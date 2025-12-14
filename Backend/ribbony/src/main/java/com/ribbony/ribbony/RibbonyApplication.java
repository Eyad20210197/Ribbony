package com.ribbony.ribbony;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class RibbonyApplication {

    public static void main(String[] args) {
        SpringApplication.run(RibbonyApplication.class, args);
    }
}
