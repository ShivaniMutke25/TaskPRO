package com.taskflow.task.service;

import com.taskflow.task.dto.*;
import com.taskflow.task.entity.Priority;
import com.taskflow.task.entity.Task;
import com.taskflow.task.entity.TaskStatus;
import com.taskflow.task.event.TaskEvent;
import com.taskflow.task.exception.TaskNotFoundException;
import com.taskflow.task.kafka.TaskEventProducer;
import com.taskflow.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskEventProducer eventProducer;

    @CacheEvict(value = "tasks", allEntries = true)
    public TaskResponse createTask(TaskRequest request, String createdBy) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM)
                .dueDate(request.getDueDate())
                .createdBy(createdBy)
                .assignedTo(request.getAssignedTo())
                .build();

        Task saved = taskRepository.save(task);

        eventProducer.publishTaskEvent(TaskEvent.builder()
                .eventType("TASK_CREATED")
                .taskId(saved.getId())
                .title(saved.getTitle())
                .createdBy(saved.getCreatedBy())
                .assignedTo(saved.getAssignedTo())
                .timestamp(LocalDateTime.now())
                .build());

        return toResponse(saved);
    }

    @Cacheable(value = "tasks", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #status")
    public Page<TaskResponse> getAllTasks(TaskStatus status, Pageable pageable) {
        Page<Task> tasks;
        if (status != null) {
            tasks = taskRepository.findByStatus(status, pageable);
        } else {
            tasks = taskRepository.findAll(pageable);
        }
        return tasks.map(this::toResponse);
    }

    @Cacheable(value = "task", key = "#id")
    public TaskResponse getTaskById(Long id) {
        return toResponse(findTaskById(id));
    }

    @CacheEvict(value = {"tasks", "task"}, allEntries = true)
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = findTaskById(id);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        return toResponse(taskRepository.save(task));
    }

    @CacheEvict(value = {"tasks", "task"}, allEntries = true)
    public TaskResponse updateStatus(Long id, StatusUpdateRequest request) {
        Task task = findTaskById(id);
        TaskStatus newStatus = TaskStatus.valueOf(request.getStatus().toUpperCase());
        task.setStatus(newStatus);
        Task saved = taskRepository.save(task);

        if (newStatus == TaskStatus.DONE) {
            eventProducer.publishTaskEvent(TaskEvent.builder()
                    .eventType("TASK_COMPLETED")
                    .taskId(saved.getId())
                    .title(saved.getTitle())
                    .createdBy(saved.getCreatedBy())
                    .assignedTo(saved.getAssignedTo())
                    .timestamp(LocalDateTime.now())
                    .build());
        }

        return toResponse(saved);
    }

    @CacheEvict(value = {"tasks", "task"}, allEntries = true)
    public TaskResponse assignTask(Long id, AssignRequest request) {
        Task task = findTaskById(id);
        task.setAssignedTo(request.getAssignedTo());
        Task saved = taskRepository.save(task);

        eventProducer.publishTaskEvent(TaskEvent.builder()
                .eventType("TASK_ASSIGNED")
                .taskId(saved.getId())
                .title(saved.getTitle())
                .createdBy(saved.getCreatedBy())
                .assignedTo(saved.getAssignedTo())
                .timestamp(LocalDateTime.now())
                .build());

        return toResponse(saved);
    }

    @CacheEvict(value = {"tasks", "task"}, allEntries = true)
    public void deleteTask(Long id) {
        Task task = findTaskById(id);
        taskRepository.delete(task);
    }

    private Task findTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + id));
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdBy(task.getCreatedBy())
                .assignedTo(task.getAssignedTo())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
