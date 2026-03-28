export interface ClinicalFile {
  id: string;
  patientId: string;
  clinicalEvolutionId?: string;
  fileName: string;
  fileKey: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: string;
}

export interface ClinicalFileFilters {
  page?: number;
  limit?: number;
  patientId?: string;
}
