export interface Restaurant {
  user : User;
  contact : Contact;
  address : Address;
}

export interface User {
  email: string;
  id: string;
  registered_at: string;
}

export interface Contact {
  email: string;
  name: string;
  phone: string;
}

export interface Address {
  address_detail: string;
  city: string;
  image_url: string;
  province: string;
}

export interface ListRestaurant {
  name: string;
  id: string;
}