export interface Event {
    id: number;
    name: string;
    event_type: string;
    location: string;
    image: string;
    date_begin: string;
    date_end: string;
}

export interface EventDetails extends Event {
    address: string;
    description: string;
    price: string;
    www_url: string;
    event_url: string;
    fb_url: string;
}
