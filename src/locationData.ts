export type Location = {
  id: string
  latitude: string
  longitude: string
  background?: string
}

export const LOCATIONS: Location[] = [
  {
    id: 'koolani',
    latitude: '21.292881',
    longitude: '-157.849152',
    background: '/images/koolani.jpeg',
    // background: koolani,
  },
  {
    id: 'petrie',
    latitude: '21.2755462328682',
    longitude: '-157.79211045466258',
  },
  {
    id: 'paki',
    latitude: '21.271560',
    longitude: '-157.815752',
  },
  {
    id: 'moana loa',
    latitude: '21.347716',
    longitude: '-157.900106',
  },
  {
    id: 'mahiko',
    latitude: '21.338502',
    longitude: '-158.036160',
  },
  {
    id: 'kailua district park',
    latitude: '21.394745',
    longitude: '-157.738063',
  },
  {
    id: 'kalakaua district park',
    latitude: '21.32696557039398',
    longitude: '-157.8768696893912',
  },
]
