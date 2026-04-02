package com.taskflow.task.dto;

import com.taskflow.task.entity.Priority;
import com.taskflow.task.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank
    private String title;
    private String description;
    private Priority priority;
    private LocalDate dueDate;
    private String assignedTo;
}
