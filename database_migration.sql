-- OMS Database Migration Script
-- Adds missing columns for hierarchical leave approval workflow

-- Add new columns to leave_requests table
ALTER TABLE leave_requests 
ADD COLUMN manager_approval_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN hr_approval_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN manager_approved_by INT,
ADD COLUMN manager_rejected_by INT,
ADD COLUMN hr_approved_by INT,
ADD COLUMN hr_rejected_by INT,
ADD COLUMN rejection_date TIMESTAMP NULL,
ADD COLUMN manager_approval_date TIMESTAMP NULL,
ADD COLUMN manager_rejection_date TIMESTAMP NULL,
ADD COLUMN hr_approval_date TIMESTAMP NULL,
ADD COLUMN hr_rejection_date TIMESTAMP NULL,
ADD COLUMN manager_approval_notes TEXT,
ADD COLUMN manager_rejection_notes TEXT,
ADD COLUMN hr_approval_notes TEXT,
ADD COLUMN hr_rejection_notes TEXT;

-- Add foreign key constraints for the new columns
ALTER TABLE leave_requests 
ADD CONSTRAINT fk_leave_requests_manager_approved_by 
    FOREIGN KEY (manager_approved_by) REFERENCES employees(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_leave_requests_manager_rejected_by 
    FOREIGN KEY (manager_rejected_by) REFERENCES employees(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_leave_requests_hr_approved_by 
    FOREIGN KEY (hr_approved_by) REFERENCES employees(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_leave_requests_hr_rejected_by 
    FOREIGN KEY (hr_rejected_by) REFERENCES employees(id) ON DELETE SET NULL;

-- Update any existing leave requests to have proper status
UPDATE leave_requests 
SET manager_approval_status = CASE 
    WHEN status = 'approved' THEN 'approved'
    WHEN status = 'rejected' THEN 'rejected'
    ELSE 'pending'
END,
hr_approval_status = CASE 
    WHEN status = 'approved' THEN 'approved'
    WHEN status = 'rejected' THEN 'rejected'
    ELSE 'pending'
END
WHERE 1=1;

-- Create roles table if it doesn't exist (in case it wasn't created during initial setup)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50),
    permission_id INT,
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Create invoices table if it doesn't exist
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    org_id INT,
    invoice_number VARCHAR(50) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_address TEXT,
    amount DECIMAL(10, 2),
    tax_amount DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    issue_date DATE,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'draft',
    payment_method VARCHAR(50),
    payment_date DATE,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE SET NULL
);

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(20) NOT NULL,
    user_id VARCHAR(255),
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default roles if they don't exist
INSERT IGNORE INTO roles (name, slug, description) VALUES
('CEO', 'ceo', 'Chief Executive Officer'),
('CPO', 'cpo', 'Chief Product Officer'),
('CTO', 'cto', 'Chief Technology Officer'),
('CIO', 'cio', 'Chief Information Officer'),
('General Manager', 'general_manager', 'General Manager'),
('HR Manager', 'hr_manager', 'Human Resources Manager'),
('Finance Manager', 'finance_manager', 'Finance Manager'),
('Assistant Manager', 'assistant_manager', 'Assistant Manager'),
('Senior Employee', 'senior_employee', 'Senior Employee'),
('Junior Employee', 'junior_employee', 'Junior Employee'),
('Intern', 'intern', 'Intern');

-- Insert default permissions if they don't exist
INSERT IGNORE INTO permissions (name, resource, action, description) VALUES
('tasks.create', 'tasks', 'create', 'Can create tasks'),
('tasks.read', 'tasks', 'read', 'Can read tasks'),
('tasks.update', 'tasks', 'update', 'Can update tasks'),
('tasks.delete', 'tasks', 'delete', 'Can delete tasks'),
('tasks.view', 'tasks', 'view', 'Can view tasks'),
('tasks.manage', 'tasks', 'manage', 'Can manage tasks'),
('employees.create', 'employees', 'create', 'Can create employees'),
('employees.read', 'employees', 'read', 'Can read employees'),
('employees.update', 'employees', 'update', 'Can update employees'),
('employees.delete', 'employees', 'delete', 'Can delete employees'),
('employees.view', 'employees', 'view', 'Can view employees'),
('employees.manage', 'employees', 'manage', 'Can manage employees'),
('departments.create', 'departments', 'create', 'Can create departments'),
('departments.read', 'departments', 'read', 'Can read departments'),
('departments.update', 'departments', 'update', 'Can update departments'),
('departments.delete', 'departments', 'delete', 'Can delete departments'),
('departments.view', 'departments', 'view', 'Can view departments'),
('departments.manage', 'departments', 'manage', 'Can manage departments'),
('settings.create', 'settings', 'create', 'Can create settings'),
('settings.read', 'settings', 'read', 'Can read settings'),
('settings.update', 'settings', 'update', 'Can update settings'),
('settings.delete', 'settings', 'delete', 'Can delete settings'),
('settings.view', 'settings', 'view', 'Can view settings'),
('settings.manage', 'settings', 'manage', 'Can manage settings'),
('analytics.create', 'analytics', 'create', 'Can create analytics'),
('analytics.read', 'analytics', 'read', 'Can read analytics'),
('analytics.update', 'analytics', 'update', 'Can update analytics'),
('analytics.delete', 'analytics', 'delete', 'Can delete analytics'),
('analytics.view', 'analytics', 'view', 'Can view analytics'),
('analytics.manage', 'analytics', 'manage', 'Can manage analytics'),
('permissions.create', 'permissions', 'create', 'Can create permissions'),
('permissions.read', 'permissions', 'read', 'Can read permissions'),
('permissions.update', 'permissions', 'update', 'Can update permissions'),
('permissions.delete', 'permissions', 'delete', 'Can delete permissions'),
('permissions.view', 'permissions', 'view', 'Can view permissions'),
('permissions.manage', 'permissions', 'manage', 'Can manage permissions'),
('organizations.create', 'organizations', 'create', 'Can create organizations'),
('organizations.read', 'organizations', 'read', 'Can read organizations'),
('organizations.update', 'organizations', 'update', 'Can update organizations'),
('organizations.delete', 'organizations', 'delete', 'Can delete organizations'),
('organizations.view', 'organizations', 'view', 'Can view organizations'),
('organizations.manage', 'organizations', 'manage', 'Can manage organizations');

-- Update employee table to include role_id if it doesn't exist
SET @role_id_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                      WHERE TABLE_NAME = 'employees' AND COLUMN_NAME = 'role_id' 
                      AND TABLE_SCHEMA = DATABASE());

IF @role_id_exists = 0 THEN
    ALTER TABLE employees ADD COLUMN role_id INT;
    ALTER TABLE employees ADD CONSTRAINT fk_employees_role 
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;
    
    -- Set role_id for existing employees based on their role
    UPDATE employees e
    JOIN roles r ON e.role = r.name
    SET e.role_id = r.id
    WHERE e.role IS NOT NULL;
END IF;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_org_dept ON employees(org_id, department_id);
CREATE INDEX IF NOT EXISTS idx_tasks_org_assignee ON tasks(org_id, assignee_id);

-- Update existing employees to have proper role_id if not already set
UPDATE employees e
JOIN roles r ON e.role = r.name
SET e.role_id = r.id
WHERE e.role_id IS NULL AND e.role IS NOT NULL;

-- Add proper cascade options to existing foreign keys if needed
ALTER TABLE tasks 
DROP FOREIGN KEY IF EXISTS fk_tasks_assignee,
ADD CONSTRAINT fk_tasks_assignee 
    FOREIGN KEY (assignee_id) REFERENCES employees(id) ON DELETE SET NULL;

ALTER TABLE tasks 
DROP FOREIGN KEY IF EXISTS fk_tasks_creator,
ADD CONSTRAINT fk_tasks_creator 
    FOREIGN KEY (created_by_id) REFERENCES employees(id) ON DELETE SET NULL;

-- Update any existing leave requests to use the new workflow
UPDATE leave_requests 
SET status = 'pending' 
WHERE status IN ('submitted', 'under_review', 'waiting_approval');

-- Create a trigger to automatically update the overall status based on manager and HR approval
DELIMITER //

CREATE TRIGGER IF NOT EXISTS update_leave_request_status
AFTER UPDATE ON leave_requests
FOR EACH ROW
BEGIN
    -- If both manager and HR have approved, set overall status to approved
    IF NEW.manager_approval_status = 'approved' AND NEW.hr_approval_status = 'approved' THEN
        UPDATE leave_requests 
        SET status = 'approved', approval_date = NOW()
        WHERE id = NEW.id;
    -- If either manager or HR has rejected, set overall status to rejected
    ELSEIF NEW.manager_approval_status = 'rejected' OR NEW.hr_approval_status = 'rejected' THEN
        UPDATE leave_requests 
        SET status = 'rejected', rejection_date = NOW()
        WHERE id = NEW.id;
    END IF;
END//

DELIMITER ;

-- Display summary of changes
SELECT 
    'Roles' as table_name, COUNT(*) as count FROM roles
UNION ALL
SELECT 
    'Permissions' as table_name, COUNT(*) as count FROM permissions
UNION ALL
SELECT 
    'Leave Requests' as table_name, COUNT(*) as count FROM leave_requests
UNION ALL
SELECT 
    'Invoices' as table_name, COUNT(*) as count FROM invoices
UNION ALL
SELECT 
    'Audit Logs' as table_name, COUNT(*) as count FROM audit_logs;