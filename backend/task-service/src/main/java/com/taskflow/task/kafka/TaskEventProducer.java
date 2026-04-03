package com.taskflow.task.kafka;

import com.taskflow.task.event.TaskEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskEventProducer {

    private static final String TOPIC = "task-events";

    private final KafkaTemplate<String, TaskEvent> kafkaTemplate;

    public void publishTaskEvent(TaskEvent event) {
        log.info("Publishing Kafka event: {} for taskId: {}", event.getEventType(), event.getTaskId());
        kafkaTemplate.send(TOPIC, event.getTaskId().toString(), event);
    }
}
