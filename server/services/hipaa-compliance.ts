import { db } from '../db';
import { employees, users } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

/**
 * Service for HIPAA-compliant data handling
 * Implements data protection measures required for healthcare compliance
 */
export class HipaaComplianceService {
  /**
   * Sanitize sensitive data before logging or transmission
   * @param data - Raw data object containing potentially sensitive information
   * @returns Cleaned data object with sensitive fields masked
   */
  static sanitizeSensitiveData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sanitized = { ...data };
    
    // Fields that typically contain sensitive information
    const sensitiveFields = [
      'password', 'ssn', 'socialSecurityNumber', 'healthInformation', 
      'medicalRecords', 'insuranceNumber', 'bankAccount', 'creditCard',
      'address', 'phone', 'email', 'firstName', 'lastName'
    ];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        // For audit logs, we might want to keep partial information
        if (field === 'email') {
          sanitized[field] = this.maskEmail(sanitized[field]);
        } else if (['firstName', 'lastName'].includes(field)) {
          sanitized[field] = this.maskName(sanitized[field]);
        } else if (field === 'phone') {
          sanitized[field] = this.maskPhone(sanitized[field]);
        } else {
          // For other sensitive fields, we'll mask them completely in logs
          sanitized[field] = '[REDACTED]';
        }
      }
    }

    return sanitized;
  }

  /**
   * Mask email addresses for privacy
   */
  private static maskEmail(email: string): string {
    if (!email || typeof email !== 'string') return email;
    
    const parts = email.split('@');
    if (parts.length !== 2) return email;

    const [localPart, domain] = parts;
    if (localPart.length <= 2) {
      return '*'.repeat(localPart.length) + '@' + domain;
    }

    return localPart.substring(0, 1) + '*'.repeat(localPart.length - 2) + 
           localPart.substring(localPart.length - 1) + '@' + domain;
  }

  /**
   * Mask phone numbers for privacy
   */
  private static maskPhone(phone: string): string {
    if (!phone || typeof phone !== 'string') return phone;
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 4) {
      return '*'.repeat(digitsOnly.length);
    }

    // Show last 4 digits, mask the rest
    const visibleDigits = digitsOnly.slice(-4);
    const maskedDigits = '*'.repeat(digitsOnly.length - 4);
    
    return maskedDigits + visibleDigits;
  }

  /**
   * Mask names for privacy
   */
  private static maskName(name: string): string {
    if (!name || typeof name !== 'string') return name;
    
    if (name.length <= 1) {
      return '*';
    }

    return name.substring(0, 1) + '*'.repeat(name.length - 1);
  }

  /**
   * Validate that data access complies with HIPAA requirements
   */
  static async validateDataAccess(userId: string, requestedUserId?: string, requestedEmployeeId?: number): Promise<boolean> {
    // In a real implementation, this would check:
    // 1. User has proper authorization
    // 2. Access is for treatment, payment, or healthcare operations
    // 3. Minimum necessary principle is applied
    
    // For now, we'll implement basic checks
    if (!userId) {
      return false;
    }

    // If accessing own data, allow
    if (requestedUserId && requestedUserId === userId) {
      return true;
    }

    // If accessing employee data linked to user, allow
    if (requestedEmployeeId) {
      const employeeResult = await db
        .select()
        .from(employees)
        .where(and(
          eq(employees.id, requestedEmployeeId),
          eq(employees.userId, userId)
        ));

      if (employeeResult.length > 0) {
        return true;
      }
    }

    // Additional authorization checks would go here
    // This is where you'd implement role-based access controls
    return false;
  }

  /**
   * Encrypt sensitive data before storage
   */
  static encryptData(data: string, key?: string): string {
    // In a real HIPAA implementation, you'd use proper encryption
    // For this demo, we'll return the data as-is but note that
    // real implementation should use AES-256 or similar
    console.warn('Encryption not fully implemented - this is a placeholder');
    return data;
  }

  /**
   * Decrypt sensitive data after retrieval
   */
  static decryptData(encryptedData: string, key?: string): string {
    // In a real HIPAA implementation, you'd use proper decryption
    console.warn('Decryption not fully implemented - this is a placeholder');
    return encryptedData;
  }

  /**
   * Generate audit trail for data access (required for HIPAA compliance)
   */
  static async logDataAccess(userId: string, action: string, resource: string, details?: any) {
    // This would integrate with the audit logging system
    console.log(`HIPAA Audit: User ${userId} performed ${action} on ${resource}`, details);
    // In production, this would call the audit logging service
  }

  /**
   * Ensure minimum necessary data is exposed
   */
  static applyMinimumNecessaryPrinciple(data: any, requesterRole: string, requestedResource: string): any {
    // Apply different data masking based on role and resource
    if (!data) return data;

    // Define what data different roles can see
    const accessRules: { [role: string]: { [resource: string]: string[] } } = {
      'Intern': {
        'employee': ['id', 'firstName', 'lastName', 'department'],
        'task': ['id', 'title', 'description', 'status']
      },
      'Junior Employee': {
        'employee': ['id', 'firstName', 'lastName', 'department', 'designation'],
        'task': ['id', 'title', 'description', 'status', 'assignee']
      },
      'Senior Employee': {
        'employee': ['id', 'firstName', 'lastName', 'department', 'designation', 'joiningDate'],
        'task': ['id', 'title', 'description', 'status', 'assignee', 'creator', 'dueDate']
      },
      'Manager': {
        'employee': ['id', 'firstName', 'lastName', 'department', 'designation', 'joiningDate', 'salary'],
        'task': ['id', 'title', 'description', 'status', 'assignee', 'creator', 'dueDate', 'estimatedHours']
      },
      'HR Manager': {
        'employee': ['id', 'firstName', 'lastName', 'department', 'designation', 'joiningDate', 'salary', 'employmentType'],
        'task': ['id', 'title', 'description', 'status', 'assignee', 'creator', 'dueDate', 'estimatedHours']
      },
      'Finance Manager': {
        'employee': ['id', 'firstName', 'lastName', 'department', 'designation', 'salary'],
        'task': ['id', 'title', 'description', 'status', 'assignee', 'creator', 'dueDate', 'estimatedHours', 'actualHours']
      },
      'CTO': {
        'employee': ['id', 'firstName', 'lastName', 'department', 'designation', 'joiningDate', 'employmentType', 'salary'],
        'task': ['id', 'title', 'description', 'status', 'assignee', 'creator', 'dueDate', 'estimatedHours', 'actualHours']
      },
      'CPO': {
        'employee': ['id', 'firstName', 'lastName', 'department', 'designation', 'joiningDate', 'employmentType', 'salary'],
        'task': ['id', 'title', 'description', 'status', 'assignee', 'creator', 'dueDate', 'estimatedHours', 'actualHours']
      },
      'CIO': {
        'employee': ['id', 'firstName', 'lastName', 'department', 'designation', 'joiningDate', 'employmentType', 'salary'],
        'task': ['id', 'title', 'description', 'status', 'assignee', 'creator', 'dueDate', 'estimatedHours', 'actualHours']
      },
      'General Manager': {
        'employee': ['id', 'firstName', 'lastName', 'department', 'designation', 'joiningDate', 'employmentType', 'salary'],
        'task': ['id', 'title', 'description', 'status', 'assignee', 'creator', 'dueDate', 'estimatedHours', 'actualHours']
      },
      'CEO': {
        'employee': ['id', 'firstName', 'lastName', 'department', 'designation', 'joiningDate', 'employmentType', 'salary'],
        'task': ['id', 'title', 'description', 'status', 'assignee', 'creator', 'dueDate', 'estimatedHours', 'actualHours']
      }
    };

    if (accessRules[requesterRole]?.[requestedResource]) {
      const allowedFields = accessRules[requesterRole][requestedResource];
      const filteredData: any = {};

      if (Array.isArray(data)) {
        return data.map(item => {
          const filteredItem: any = {};
          allowedFields.forEach(field => {
            if (item.hasOwnProperty(field)) {
              filteredItem[field] = item[field];
            }
          });
          return filteredItem;
        });
      } else {
        allowedFields.forEach(field => {
          if (data.hasOwnProperty(field)) {
            filteredData[field] = data[field];
          }
        });
        return filteredData;
      }
    }

    return data; // Return all data if no specific rules apply
  }
}

export default HipaaComplianceService;