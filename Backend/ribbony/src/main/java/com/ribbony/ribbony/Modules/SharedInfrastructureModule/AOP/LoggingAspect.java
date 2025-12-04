package com.ribbony.ribbony.Modules.SharedInfrastructureModule.AOP;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

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
        log.info("ENTER: {} - args: {}",
                joinPoint.getSignature().toShortString(),
                sanitizedArgs);
    }

    @AfterReturning(value = "appLayer()", returning = "result")
    public void logMethodExit(JoinPoint joinPoint, Object result) {
        String sanitizedResult = sanitizeValue(result);
        log.info("⬅ EXIT: {} - return: {}", 
                joinPoint.getSignature().toShortString(), 
                sanitizedResult);
    }

    @AfterThrowing(value = "appLayer()", throwing = "ex")
    public void logException(JoinPoint joinPoint, Throwable ex) {
        String sanitizedMessage = sanitizeValue(ex.getMessage());
        log.error("EXCEPTION in {} - message: {}",
                joinPoint.getSignature().toShortString(),
                sanitizedMessage);
    }

    // ====== Sanitizers ======

    private String sanitizeArgs(Object[] args) {
        if (args == null || args.length == 0) {
            return "[]";
        }

        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < args.length; i++) {
            Object arg = args[i];
            sb.append(sanitizeValue(arg));
            if (i < args.length - 1) {
                sb.append(", ");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    private String sanitizeValue(Object value) {
        if (value == null) {
            return "null";
        }

        String s = String.valueOf(value);

        // password patterns
        s = s.replaceAll("(?i)password=[^,\\]\\)}]*", "password=****");
        s = s.replaceAll("(?i)userPassword=[^,\\]\\)}]*", "userPassword=****");
        s = s.replaceAll("(?i)\"password\"\\s*:\\s*\"[^\"]*\"", "\"password\":\"****\"");
        s = s.replaceAll("(?i)\"userPassword\"\\s*:\\s*\"[^\"]*\"", "\"userPassword\":\"****\"");

        // token patterns
        s = s.replaceAll("(?i)token=[^,\\]\\)}]*", "token=****");
        s = s.replaceAll("(?i)accessToken=[^,\\]\\)}]*", "accessToken=****");
        s = s.replaceAll("(?i)refreshToken=[^,\\]\\)}]*", "refreshToken=****");
        s = s.replaceAll("(?i)\"token\"\\s*:\\s*\"[^\"]*\"", "\"token\":\"****\"");
        s = s.replaceAll("(?i)\"accessToken\"\\s*:\\s*\"[^\"]*\"", "\"accessToken\":\"****\"");
        s = s.replaceAll("(?i)\"refreshToken\"\\s*:\\s*\"[^\"]*\"", "\"refreshToken\":\"****\"");

        return s;
    }
}
