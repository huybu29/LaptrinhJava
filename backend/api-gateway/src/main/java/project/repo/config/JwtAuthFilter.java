package project.repo.config;

import org.springframework.stereotype.Component;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    // 🔐 Khóa bí mật (ít nhất 32 bytes ~ 256 bit)
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(
            "ThisIsA32ByteLongSecretKeyForJWTs123456!!!".getBytes(StandardCharsets.UTF_8)
    );

    public JwtAuthFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");

            // 🔸 Nếu không có token, cho phép request đi tiếp (public endpoint)
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return chain.filter(exchange);
            }

            String token = authHeader.substring(7);

            try {
                // ✅ Parse và xác thực JWT
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(SECRET_KEY)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                // 🔹 Lấy userId và role từ payload
                Object userIdObj = claims.get("userId");
                Object roleObj = claims.get("role"); // <— thêm dòng này
                Object stationIdObj = claims.get("stationId"); // <— thêm dòng này
                // 🔹 Gắn header mới vào request nếu có
                var mutatedRequest = exchange.getRequest().mutate();

                if (userIdObj != null) {
                    String userId = String.valueOf(userIdObj);
                    mutatedRequest.header("X-User-Id", userId);
                    System.out.println("✅ JWT hợp lệ. Gắn X-User-Id = " + userId);
                }

                if (roleObj != null) {
                    String role = String.valueOf(roleObj);
                    mutatedRequest.header("X-User-Role", role);
                    System.out.println("✅ JWT hợp lệ. Gắn X-User-Role = " + role);
                } else {
                    System.out.println("⚠️ JWT không chứa role.");
                }
                if (stationIdObj != null) {
                    String stationId = String.valueOf(stationIdObj);
                    mutatedRequest.header("X-Station-Id", stationId);
                    System.out.println("✅ JWT hợp lệ. Gắn X-Station-Id = " + stationId);
                }

                exchange = exchange.mutate().request(mutatedRequest.build()).build();

            } catch (Exception e) {
                // ⚠️ JWT không hợp lệ → không chặn request, chỉ ghi log
                System.out.println("❌ Invalid JWT: " + e.getMessage());
            }

            // Tiếp tục chuỗi filter
            return chain.filter(exchange);
        };
    }

    public static class Config {}
}
