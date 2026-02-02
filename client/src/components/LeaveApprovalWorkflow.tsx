import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { User, ChevronRight, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
import { LeaveRequest } from "../../../shared/schema";

interface LeaveApprovalWorkflowProps {
  leaveRequest: LeaveRequest & {
    employee: any;
    managerApprovedBy?: any;
    managerRejectedBy?: any;
    hrApprovedBy?: any;
    hrRejectedBy?: any;
  };
}

export function LeaveApprovalWorkflow({ leaveRequest }: LeaveApprovalWorkflowProps) {
  const getStatusInfo = (status: string | null | undefined) => {
    switch (status) {
      case 'approved':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' };
      default:
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' };
    }
  };

  const employeeStatus = leaveRequest.status;
  const managerStatus = leaveRequest.managerApprovalStatus;
  const hrStatus = leaveRequest.hrApprovalStatus;

  const employeeStatusInfo = getStatusInfo(employeeStatus);
  const managerStatusInfo = getStatusInfo(managerStatus);
  const hrStatusInfo = getStatusInfo(hrStatus);

  const EmployeeIcon = employeeStatusInfo.icon;
  const ManagerIcon = managerStatusInfo.icon;
  const HRIcon = hrStatusInfo.icon;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Leave Approval Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {/* Employee Step */}
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-full ${employeeStatusInfo.color}`}
            >
              <User className="w-6 h-6" />
            </motion.div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">Employee</p>
              <p className="text-xs text-muted-foreground">{leaveRequest.employee?.firstName} {leaveRequest.employee?.lastName}</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                Applied
              </Badge>
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="w-5 h-5 text-muted-foreground" />

          {/* Manager Step */}
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-full ${managerStatusInfo.color}`}
            >
              <User className="w-6 h-6" />
            </motion.div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">Manager</p>
              {leaveRequest.managerApprovedBy || leaveRequest.managerRejectedBy ? (
                <p className="text-xs text-muted-foreground">
                  {leaveRequest.managerApprovedBy?.firstName || leaveRequest.managerRejectedBy?.firstName}{' '}
                  {leaveRequest.managerApprovedBy?.lastName || leaveRequest.managerRejectedBy?.lastName}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Pending</p>
              )}
              <Badge className={`${managerStatusInfo.color.replace('bg-', 'border-').replace('text-', '')} mt-1 text-xs`}>
                {managerStatusInfo.label}
              </Badge>
              {(leaveRequest.managerApprovalNotes || leaveRequest.managerRejectionNotes) && (
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-[100px]">
                    {leaveRequest.managerApprovalNotes || leaveRequest.managerRejectionNotes}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="w-5 h-5 text-muted-foreground" />

          {/* HR Step */}
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded-full ${hrStatusInfo.color}`}
            >
              <User className="w-6 h-6" />
            </motion.div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">HR</p>
              {leaveRequest.hrApprovedBy || leaveRequest.hrRejectedBy ? (
                <p className="text-xs text-muted-foreground">
                  {leaveRequest.hrApprovedBy?.firstName || leaveRequest.hrRejectedBy?.firstName}{' '}
                  {leaveRequest.hrApprovedBy?.lastName || leaveRequest.hrRejectedBy?.lastName}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">Pending</p>
              )}
              <Badge className={`${hrStatusInfo.color.replace('bg-', 'border-').replace('text-', '')} mt-1 text-xs`}>
                {hrStatusInfo.label}
              </Badge>
              {(leaveRequest.hrApprovalNotes || leaveRequest.hrRejectionNotes) && (
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-[100px]">
                    {leaveRequest.hrApprovalNotes || leaveRequest.hrRejectionNotes}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Approval Status</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="font-medium">Employee:</span> {employeeStatusInfo.label}
            </div>
            <div>
              <span className="font-medium">Manager:</span> {managerStatusInfo.label}
            </div>
            <div>
              <span className="font-medium">HR:</span> {hrStatusInfo.label}
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Overall:</span>{' '}
            <Badge className={`${getStatusInfo(leaveRequest.status).color.replace('bg-', 'border-').replace('text-', '')}`}>
              {getStatusInfo(leaveRequest.status).label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}