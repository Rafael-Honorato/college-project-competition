export interface Competitions {
  competitionId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export type CreateCompetitionDto = Omit<
  Competitions,
  'competitionId' | 'createdAt'
>;

export type GalByIdCompetition = Pick<Competitions, 'competitionId'>;
