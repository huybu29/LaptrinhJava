package project.repo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class JwtService {

    @Value("${jwt.secret:MY_SECRET_KEY_1234567890}") // có thể set trong application.properties
    private String SECRET;

    @Value("${jwt.expiration:3600000}") // 1 giờ mặc định
    private long EXPIRATION;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 🔹 Hàm ký HMAC-SHA256
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

    // 🔹 Tạo token (lưu username + role)
    public String generateToken(String username, String role) {
        long now = System.currentTimeMillis();
        long exp = now + EXPIRATION;

        String header = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));

        String payload = String.format(
                "{\"sub\":\"%s\",\"role\":\"%s\",\"iat\":%d,\"exp\":%d}",
                username, role, now / 1000, exp / 1000
        );
        String payloadBase64 = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));

        String signature = hmacSha256(header + "." + payloadBase64, SECRET);

        return header + "." + payloadBase64 + "." + signature;
    }

    // 🔹 Lấy username từ token
    public String extractUsername(String token) {
        try {
            String payloadJson = decodePayload(token);
            JsonNode node = objectMapper.readTree(payloadJson);
            return node.get("sub").asText();
        } catch (Exception e) {
            return null;
        }
    }

    // 🔹 Lấy role từ token
    public String extractRole(String token) {
        try {
            String payloadJson = decodePayload(token);
            JsonNode node = objectMapper.readTree(payloadJson);
            return node.get("role").asText();
        } catch (Exception e) {
            return null;
        }
    }

    // 🔹 Kiểm tra token có hợp lệ cho username (phiên bản cũ)
    public boolean validateToken(String token, String username) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) return false;

            // kiểm tra chữ ký
            String signatureCheck = hmacSha256(parts[0] + "." + parts[1], SECRET);
            if (!signatureCheck.equals(parts[2])) return false;

            // giải mã payload
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            JsonNode node = objectMapper.readTree(payloadJson);

            // check exp
            long exp = node.get("exp").asLong();
            if (exp * 1000 <= System.currentTimeMillis()) {
                return false; // token hết hạn
            }

            // check username
            String subject = node.get("sub").asText();
            return subject.equals(username); // username trong token phải khớp
        } catch (Exception e) {
            return false;
        }
    }

    // 🔹 Kiểm tra token có hợp lệ với UserDetails (phiên bản chuẩn)
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // 🔹 Kiểm tra token hết hạn
    private boolean isTokenExpired(String token) {
        try {
            String payloadJson = decodePayload(token);
            JsonNode node = objectMapper.readTree(payloadJson);
            long exp = node.get("exp").asLong();
            return exp * 1000 <= System.currentTimeMillis();
        } catch (Exception e) {
            return true;
        }
    }

    // 🔹 Hàm decode payload
    private String decodePayload(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) throw new IllegalArgumentException("Invalid JWT");
        return new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
    }
}
