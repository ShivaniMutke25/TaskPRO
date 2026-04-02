package com.taskflow.notification.entity;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId;      // recipient email
    private String type;        // TASK_CREATED, TASK_ASSIGNED, TASK_COMPLETED
    private String message;
    private Long taskId;
    private LocalDateTime createdAt;
}
