'use client'
import React, { useState, useEffect } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { useBreakpointValue } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import EventList from '@/Components/EventList/EventList';
import axios from 'axios';
import { SERVER_URL } from "../../api";
import '../app/home/Home.css';
import { Address } from "@/Components/Map/Map";

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

const DynamicMap = dynamic(() => import('@/Components/Map/Map'), { ssr: false });
const NavBar = dynamic(() => import('@/Components/NavBar/NavBar'), { ssr: false });

const Welcome = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [addresses, setAddresses] = useState<Event[]>([]);

    const handleSearch = () => { };
    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventsResponse = await axios.get<Event[]>(`${SERVER_URL}/events`);
                setEvents(eventsResponse.data);
                setAddresses(eventsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const userCoordinates: any = localStorage.getItem("cityCoords");
    const userCoordObj = JSON.parse(userCoordinates);

    return (
        <Flex className="welcome-container" direction="column">
            <NavBar onSearch={handleSearch} />
            <Flex
                flexDirection='row'
                alignItems="center"
                justifyContent="space-between"
                paddingLeft="50px"
                paddingRight="50px"
            >
                <Box className="welcome-text">
                    Discover, create, and join events with us
                </Box>
                {isMobile ? (
                    <Box width="100%">
                        <EventList events={events} />
                    </Box>
                ) : (
                    <>
                        <Box flexGrow={2} marginTop='125px' marginRight='50px' zIndex={0}>
                            <DynamicMap height='72vh' events={addresses} isEventDetails={null} lonCenter={userCoordObj ? userCoordObj.latitude : 32.109333} latCenter={userCoordObj ? userCoordObj.longitude : 34.855499} />
                        </Box>
                        <Box justifyContent='space-around' alignItems='center' width="60%" marginTop='120px'>
                            <EventList events={events} />
                        </Box>

                    </>
                )}
            </Flex>
            <Box
                position="fixed"
                bottom="20px"
                right="20px"
                zIndex="999"
                fontSize="10px"
            >
            </Box>
        </Flex>
    );
};

export default Welcome;
