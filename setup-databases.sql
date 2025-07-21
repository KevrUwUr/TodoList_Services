-- Script para crear bases de datos separadas para microservicios
CREATE DATABASE auth_service_db;
CREATE DATABASE user_service_db;
CREATE DATABASE project_service_db;
CREATE DATABASE task_service_db;
CREATE DATABASE comment_service_db;
CREATE DATABASE notification_service_db;

-- Crear usuario para cada servicio (opcional pero recomendado)
CREATE USER 'auth_service'@'%' IDENTIFIED BY 'auth_password';
CREATE USER 'user_service'@'%' IDENTIFIED BY 'user_password';
CREATE USER 'project_service'@'%' IDENTIFIED BY 'project_password';
CREATE USER 'task_service'@'%' IDENTIFIED BY 'task_password';
CREATE USER 'comment_service'@'%' IDENTIFIED BY 'comment_password';
CREATE USER 'notification_service'@'%' IDENTIFIED BY 'notification_password';

-- Otorgar permisos específicos
GRANT ALL PRIVILEGES ON auth_service_db.* TO 'auth_service'@'%';
GRANT ALL PRIVILEGES ON user_service_db.* TO 'user_service'@'%';
GRANT ALL PRIVILEGES ON project_service_db.* TO 'project_service'@'%';
GRANT ALL PRIVILEGES ON task_service_db.* TO 'task_service'@'%';
GRANT ALL PRIVILEGES ON comment_service_db.* TO 'comment_service'@'%';
GRANT ALL PRIVILEGES ON notification_service_db.* TO 'notification_service'@'%';

FLUSH PRIVILEGES;
