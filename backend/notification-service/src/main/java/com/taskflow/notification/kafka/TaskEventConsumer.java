package com.taskflow.notification.kafka;

import com.taskflow.notification.event.TaskEvent;
import com.taskflow.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "task-events", groupId = "notification-group")
    public void consume(TaskEvent event) {
        log.info("Received Kafka event: {} for taskId: {}", event.getEventType(), event.getTaskId());
        notificationService.processTaskEvent(event);
    }
}
