package com.ribbony.ribbony.Modules.SharedInfrastructureModule.AOP;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Pointcut("within(com.ribbony.ribbony.Modules..Controller..*)")
    public void controllerLayer() {}

    @Pointcut("within(com.ribbony.ribbony.Modules..Service..*)")
    public void serviceLayer() {}

    @Pointcut("controllerLayer() || serviceLayer()")
    public void appLayer() {}

    @Before("appLayer()")
    public void logMethodEntry(JoinPoint joinPoint) {
        String sanitizedArgs = sanitizeArgs(joinPoint.getArgs());
        log.info("ENTER: {} - args: {}", joinPoint.getSignature().toShortString(), sanitizedArgs);
    }

    @AfterReturning(value = "appLayer()", returning = "result")
    public void logMethodExit(JoinPoint joinPoint, Object result) {
        String sanitizedResult = sanitizeValue(result);
        log.info("⬅ EXIT: {} - return: {}", joinPoint.getSignature().toShortString(), sanitizedResult);
    }

    @AfterThrowing(value = "appLayer()", throwing = "ex")
    public void logException(JoinPoint joinPoint, Throwable ex) {
        String sanitizedMessage = sanitizeValue(ex.getMessage());
        String maskedToken = extractMaskedTokenFromArgs(joinPoint.getArgs());
        log.error("EXCEPTION in {} - message: {} - token(masked): {}",
                joinPoint.getSignature().toShortString(),
                sanitizedMessage,
                maskedToken);
    }

    // ====== Sanitizers ======

    private String sanitizeArgs(Object[] args) {
        if (args == null || args.length == 0) return "[]";

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < args.length; i++) {
            Object arg = args[i];
            sb.append(sanitizeValue(arg));
            if (i < args.length - 1) sb.append(", ");
        }
        sb.append("]");
        return sb.toString();
    }

    private String sanitizeValue(Object value) {
        if (value == null) return "null";
        String s = String.valueOf(value);

        // mask raw JWTs and Bearer tokens first
        s = maskJwtAndBearerTokens(s);

        // basic password/token sanitizers (fallback)
        s = s.replaceAll("(?i)password=[^,\\]\\)}]*", "password=****");
        s = s.replaceAll("(?i)userPassword=[^,\\]\\)}]*", "userPassword=****");
        s = s.replaceAll("(?i)\"password\"\\s*:\\s*\"[^\"]*\"", "\"password\":\"****\"");
        s = s.replaceAll("(?i)\"userPassword\"\\s*:\\s*\"[^\"]*\"", "\"userPassword\":\"****\"");
        s = s.replaceAll("(?i)token=[^,\\]\\)}]*", "token=****");
        s = s.replaceAll("(?i)accessToken=[^,\\]\\)}]*", "accessToken=****");
        s = s.replaceAll("(?i)refreshToken=[^,\\]\\)}]*", "refreshToken=****");
        s = s.replaceAll("(?i)\"token\"\\s*:\\s*\"[^\"]*\"", "\"token\":\"****\"");
        s = s.replaceAll("(?i)\"accessToken\"\\s*:\\s*\"[^\"]*\"", "\"accessToken\":\"****\"");
        s = s.replaceAll("(?i)\"refreshToken\"\\s*:\\s*\"[^\"]*\"", "\"refreshToken\":\"****\"");

        return s;
    }

    // ---------- Helpers to mask JWT / Bearer tokens ----------
    private static final Pattern BEARER_PATTERN = Pattern.compile("(?i)(Bearer)\\s+([A-Za-z0-9\\-_=]+\\.[A-Za-z0-9\\-_=]+\\.[A-Za-z0-9\\-_=]+)");
    private static final Pattern JWT_PATTERN = Pattern.compile("([A-Za-z0-9\\-_=]+\\.[A-Za-z0-9\\-_=]+\\.[A-Za-z0-9\\-_=]+)");

    private String maskJwtAndBearerTokens(String input) {
        if (input == null || input.isEmpty()) return input;

        // 1) mask Bearer <token>
        Matcher bearerMatcher = BEARER_PATTERN.matcher(input);
        StringBuffer sb = new StringBuffer();
        while (bearerMatcher.find()) {
            String prefix = bearerMatcher.group(1);
            String token = bearerMatcher.group(2);
            String masked = prefix + " " + maskToken(token);
            bearerMatcher.appendReplacement(sb, Matcher.quoteReplacement(masked));
        }
        bearerMatcher.appendTail(sb);
        String afterBearer = sb.toString();

        // 2) mask standalone JWT-like tokens
        Matcher jwtMatcher = JWT_PATTERN.matcher(afterBearer);
        sb = new StringBuffer();
        while (jwtMatcher.find()) {
            String token = jwtMatcher.group(1);
            if (token.contains("....") || token.contains("****")) {
                jwtMatcher.appendReplacement(sb, Matcher.quoteReplacement(token));
            } else {
                jwtMatcher.appendReplacement(sb, Matcher.quoteReplacement(maskToken(token)));
            }
        }
        jwtMatcher.appendTail(sb);

        return sb.toString();
    }

    private String maskToken(String token) {
        if (token == null) return "****";
        int len = token.length();
        if (len <= 20) return "****";
        int prefix = 10;
        int suffix = 10;
        if (len <= prefix + suffix) return "****";
        String start = token.substring(0, prefix);
        String end = token.substring(len - suffix);
        return start + "...." + end;
    }

    private static final Pattern JWT_PATTERN_SIMPLE =
            Pattern.compile("([A-Za-z0-9\\-_=]+\\.[A-Za-z0-9\\-_=]+\\.[A-Za-z0-9\\-_=]+)");

    private String extractMaskedTokenFromArgs(Object[] args) {
        if (args == null) return "none";
        for (Object arg : args) {
            if (arg == null) continue;
            Matcher m = JWT_PATTERN_SIMPLE.matcher(arg.toString());
            if (m.find()) return maskToken(m.group(1));
        }
        return "none";
    }
}
