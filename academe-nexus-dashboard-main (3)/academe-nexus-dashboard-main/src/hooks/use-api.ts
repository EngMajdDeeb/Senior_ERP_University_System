import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';
import { useToast } from './use-toast';

// Authentication hooks
export const useLogin = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      apiService.login(username, password),
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: "Welcome to University ERP!",
      });
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUserInfo = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: () => apiService.getUserInfo(),
    enabled: !!localStorage.getItem('access_token'),
  });
};

// Schedules hooks
export const useSchedules = () => {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: () => apiService.getSchedules(),
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => apiService.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast({
        title: "Success",
        description: "Schedule created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create schedule",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiService.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast({
        title: "Success",
        description: "Schedule updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update schedule",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: number) => apiService.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete schedule",
        variant: "destructive",
      });
    },
  });
};

// Meetings hooks
export const useMeetings = () => {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: () => apiService.getMeetings(),
  });
};

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => apiService.createMeeting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Meeting scheduled successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule meeting",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiService.updateMeeting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update meeting",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: number) => apiService.deleteMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive",
      });
    },
  });
};

// Study Plans hooks
export const useStudyPlans = () => {
  return useQuery({
    queryKey: ['studyPlans'],
    queryFn: () => apiService.getStudyPlans(),
  });
};

export const useCreateStudyPlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => apiService.createStudyPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyPlans'] });
      toast({
        title: "Success",
        description: "Study plan created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create study plan",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStudyPlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiService.updateStudyPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyPlans'] });
      toast({
        title: "Success",
        description: "Study plan updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update study plan",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteStudyPlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: number) => apiService.deleteStudyPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyPlans'] });
      toast({
        title: "Success",
        description: "Study plan deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete study plan",
        variant: "destructive",
      });
    },
  });
};

// Recent Activities hooks
export const useRecentActivities = () => {
  return useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => apiService.getRecentActivities(),
  });
};

// Dean Services hooks
export const useDeanMeetings = () => {
  return useQuery({
    queryKey: ['deanMeetings'],
    queryFn: () => apiService.getDeanMeetings(),
  });
};

export const useDeanAcademicDecisions = () => {
  return useQuery({
    queryKey: ['deanAcademicDecisions'],
    queryFn: () => apiService.getDeanAcademicDecisions(),
  });
};

export const useDeanStudentsAttention = () => {
  return useQuery({
    queryKey: ['deanStudentsAttention'],
    queryFn: () => apiService.getDeanStudentsAttention(),
  });
};

export const useIssueDeanDecision = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: any) => apiService.issueDeanDecision(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deanAcademicDecisions'] });
      queryClient.invalidateQueries({ queryKey: ['deanStudentsAttention'] });
      toast({
        title: "Success",
        description: "Decision issued successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to issue decision",
        variant: "destructive",
      });
    },
  });
};

export const useDeanPlanApproval = () => {
  return useQuery({
    queryKey: ['deanPlanApproval'],
    queryFn: () => apiService.getDeanPlanApproval(),
  });
};

export const useApprovePlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: number) => apiService.approvePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deanPlanApproval'] });
      queryClient.invalidateQueries({ queryKey: ['studyPlans'] });
      toast({
        title: "Success",
        description: "Plan approved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve plan",
        variant: "destructive",
      });
    },
  });
};

export const useReturnPlan = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiService.returnPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deanPlanApproval'] });
      queryClient.invalidateQueries({ queryKey: ['studyPlans'] });
      toast({
        title: "Success",
        description: "Plan returned for revision",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to return plan",
        variant: "destructive",
      });
    },
  });
};

export const useDeanDashboardStats = () => {
  return useQuery({
    queryKey: ['deanDashboardStats'],
    queryFn: () => apiService.getDeanDashboardStats(),
  });
};

export const useDeanDashboardActivity = () => {
  return useQuery({
    queryKey: ['deanDashboardActivity'],
    queryFn: () => apiService.getDeanDashboardActivity(),
  });
}; 