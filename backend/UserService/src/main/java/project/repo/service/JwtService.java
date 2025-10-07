package project.repo.service;

import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    // Khóa bí mật tự định nghĩa
    private static final String SECRET = "MY_SECRET_KEY_1234567890";
    private static final long EXPIRATION = 1000 * 60 * 60; // 1 giờ

    // Hàm ký HMAC-SHA256
    private String hmacSha256(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error while signing JWT", e);
        }
    }

    // Tạo token
    public String generateToken(String username) {
        long now = System.currentTimeMillis();
        long exp = now + EXPIRATION;

        String header = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));

        String payload = String.format("{\"sub\":\"%s\",\"iat\":%d,\"exp\":%d}", username, now / 1000, exp / 1000);
        String payloadBase64 = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));

        String signature = hmacSha256(header + "." + payloadBase64, SECRET);

        return header + "." + payloadBase64 + "." + signature;
    }

    // Lấy username từ token
    public String extractUsername(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return null;

            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);

            // lấy giá trị "sub"
            int start = payloadJson.indexOf("\"sub\":\"") + 7;
            int end = payloadJson.indexOf("\"", start);
            return payloadJson.substring(start, end);
        } catch (Exception e) {
            return null;
        }
    }

    // Xác thực token
    public boolean validateToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            String signatureCheck = hmacSha256(parts[0] + "." + parts[1], SECRET);

            if (!signatureCheck.equals(parts[2])) return false;

            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);

            // lấy exp
            int start = payloadJson.indexOf("\"exp\":") + 6;
            int end = payloadJson.indexOf("}", start);
            long exp = Long.parseLong(payloadJson.substring(start, end));

            return exp * 1000 > System.currentTimeMillis(); // chưa hết hạn
        } catch (Exception e) {
            return false;
        }
    }
}
