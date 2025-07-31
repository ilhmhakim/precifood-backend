export interface Profile {
  user: User;
  medical_history: "cardiovascular" | "diabetes" | "hypertension" | "no_history";
  personal_information: PersonalInformation;
}

export interface User {
  email: string;
  id: string;
  registered_at: string;
}

export interface PersonalInformation {
  age: number;
  birth: string;
  height: number;
  name: string;
  phone : string;
  sex: string;
  weight: number;
}

export interface RegisterData {
  name?: string;
  email?: string;
  sex?: string;
  birth?: string;
  phone?: string;
  height?: number;
  weight?: number;
  medical_history?: string;
  password?: string;
  password_confirmation?: string;
}
