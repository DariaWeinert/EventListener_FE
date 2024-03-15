import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Heading, Stat, StatHelpText, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import axios from 'axios';
import Link from 'next/link';


export interface Address {
    type: string;
    coordinates: number[];
}

interface Event {
    _id: string;
    creator: string;
    date: string;
    address: Address;
    topic: string;
    category: string[];
    joinedBy: string[];
    savedBy: string[];
    membersAmount: number;
    budget: number;
    imageURL: string;
}

interface MapProps {
    events: Event[];
    height: string
    isEventDetails: any
    latCenter: number
    lonCenter: number
}

const Map: React.FC<MapProps> = ({ events, height, isEventDetails, latCenter, lonCenter }) => {
    const mapContainerRef = useRef<any>(null);
    const [coordinates, setCoordinates] = useState<{ [key: string]: { lat: string, lon: string } }>({});
    const [mapInitialized, setMapInitialized] = useState(false);
    const [humanAddress, setHumanAddress] = useState("");

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()}`;
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleTimeString()}`;
    };

    async function getAddressByCoordinates(coordinates: Array<number>) {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates[1]}&lon=${coordinates[0]}&format=geojson&accept-language=en`);
            setHumanAddress(response.data.features[0].properties.display_name);
        } catch (err: any) {
            console.log(err);
        }
    }

    return (
        <Box>
            {/* <div style={{ width: '400px', height: '65vh', marginTop: '50px', borderRadius: '5px' }} ref={mapContainerRef}> */}
            {/* <Flex width='100%' height={height} borderRadius='5px' ref={mapContainerRef}> */}
            <MapContainer center={[lonCenter, latCenter]} zoom={12} style={{ width: '100%', height: height, border: '1px', borderRadius: '5px' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {events.map(event => {
                    let lat = 0;
                    let lon = 0;
                    if (event.address && event.address.coordinates) {
                        lon = event.address.coordinates[0];
                        lat = event.address.coordinates[1];
                    }

                    //getAddressByCoordinates([lon, lat]);
                    // const latitude = parseFloat(lat);
                    // const longitude = parseFloat(lon);
                    if (!isNaN(lat) && !isNaN(lon)) {
                        return (
                            <Marker
                                eventHandlers={{
                                    click: (e) => {
                                        getAddressByCoordinates([e.latlng.lng, e.latlng.lat]);
                                    }
                                }}
                                position={[lat, lon]}
                                icon={
                                    new L.Icon({
                                        iconUrl: 'https://res.cloudinary.com/diunuo4xf/image/upload/v1710009519/EventListener/letter-e2_gyn0sw.png',
                                        iconSize: [30, 30],
                                        iconAnchor: [10, 10],
                                    })
                                }
                                key={event._id}
                            >
                                <Popup>
                                    <Stat>
                                        <StatLabel fontWeight="bold" fontSize="md">{event.topic}</StatLabel>
                                        <Divider mb={2} />
                                        <StatNumber fontSize="xs" mb={2}>{humanAddress}</StatNumber>
                                        <StatHelpText fontWeight="bold" fontSize="xs" mb={2}>{formatDate(event.date)}</StatHelpText>

                                        {!isEventDetails && <Link href={`events/${event._id}`}>
                                            <Button colorScheme='gray' size="sm" fontSize="xs">Details</Button>
                                        </Link>}
                                    </Stat>
                                    {/* {event.city}, {event.street} {event.street_number} */}
                                </Popup>
                            </Marker>
                        );
                    } else {
                        console.error(`Invalid latitude or longitude for event '${event.topic}'`);
                        return null;
                    }
                })}
            </MapContainer>
            {/* </Flex> */}
        </Box>
    );
};

export default Map;