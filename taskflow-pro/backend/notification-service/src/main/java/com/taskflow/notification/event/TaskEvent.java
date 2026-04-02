package com.taskflow.notification.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskEvent {
    private String eventType;
    private Long taskId;
    private String title;
    private String assignedTo;
    private String createdBy;
    private LocalDateTime timestamp;
}
