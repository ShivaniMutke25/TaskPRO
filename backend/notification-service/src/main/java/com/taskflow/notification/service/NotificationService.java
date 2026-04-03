package com.taskflow.notification.service;

import com.taskflow.notification.dto.NotificationResponse;
import com.taskflow.notification.entity.Notification;
import com.taskflow.notification.event.TaskEvent;
import com.taskflow.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void processTaskEvent(TaskEvent event) {
        log.info("Processing task event: {} for taskId: {}", event.getEventType(), event.getTaskId());

        String recipientUserId = determineRecipient(event);
        String message = buildMessage(event);

        Notification notification = Notification.builder()
                .userId(recipientUserId)
                .type(event.getEventType())
                .message(message)
                .taskId(event.getTaskId())
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
        log.info("Notification saved for user: {}", recipientUserId);
    }

    public List<NotificationResponse> getNotificationsForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private String determineRecipient(TaskEvent event) {
        // For TASK_ASSIGNED, notify the assignee; otherwise notify creator
        if ("TASK_ASSIGNED".equals(event.getEventType()) && event.getAssignedTo() != null) {
            return event.getAssignedTo();
        }
        return event.getCreatedBy() != null ? event.getCreatedBy() : "system";
    }

    private String buildMessage(TaskEvent event) {
        return switch (event.getEventType()) {
            case "TASK_CREATED" -> String.format("Task '%s' was created.", event.getTitle());
            case "TASK_ASSIGNED" -> String.format("Task '%s' has been assigned to you.", event.getTitle());
            case "TASK_COMPLETED" -> String.format("Task '%s' has been completed.", event.getTitle());
            default -> String.format("Task '%s' event: %s", event.getTitle(), event.getEventType());
        };
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .type(n.getType())
                .message(n.getMessage())
                .taskId(n.getTaskId())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
