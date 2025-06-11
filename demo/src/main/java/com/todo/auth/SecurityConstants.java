package com.todo.auth;

public class SecurityConstants {
    public static final String SECRET = "MySecretKeyForJWTToken2024TodoApp";
    public static final long EXPIRATION_TIME = 86400000; // 1 gün (24 saat)
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
} 