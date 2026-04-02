package com.taskflow.task.repository;

import com.taskflow.task.entity.Task;
import com.taskflow.task.entity.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
    Page<Task> findByCreatedBy(String createdBy, Pageable pageable);
    Page<Task> findByAssignedTo(String assignedTo, Pageable pageable);
}
