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
    const [loading, setLoading] = useState<boolean>(true);
    const [addresses, setAddresses] = useState<Event[]>([]);
    const [userCoords, setUserCoords] = useState<any>('');

    const isMobile = useBreakpointValue({ base: true, md: false });

    const fetchData = async () => {
        try {
            const eventsResponse = await axios.get<Event[]>(`${SERVER_URL}/events`);
            setEvents(eventsResponse.data);
            setLoading(false);
            setAddresses(eventsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchCategorizedEvents = async (config: any) => {
        try {
            const eventsResponse = await axios.get<Event[]>(`${SERVER_URL}/events/categorized`, config);
            setEvents(eventsResponse.data);
            setAddresses(eventsResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const t = localStorage.getItem("accessToken");
        const config = {
            headers: {
                Authorization: `Bearer ${t}`,
                'Content-Type': 'application/json'
            }
        };
        userId ? fetchCategorizedEvents(config) : fetchData();
    }, []);

    useEffect(() => {
        setUserCoords(localStorage.getItem("cityCoords"));
        //const userCoordObj = JSON.parse(userCoordinates);
    }, [events]);

    return (
        <Flex className="welcome-container" direction="column">
            <NavBar />
            <Flex
                flexDirection='row'
                alignItems="center"
                justifyContent="space-between"
                paddingLeft="50px" paddingBottom="50px"
                paddingRight="50px" backgroundColor='red.50'
            >
                {isMobile ? (
                    <Box width="100%">
                        <EventList events={events} loading={loading} />
                    </Box>
                ) : (
                    <>
                        <Box flexGrow={2} marginTop='125px' marginRight='50px' zIndex={0}>
                        <Box className="welcome-text" top={'150px'}>
                    Discover, create, and join events with us
                </Box> 
                            <DynamicMap height='72vh' events={addresses} isEventDetails={null} lonCenter={JSON.parse(userCoords) ? JSON.parse(userCoords).latitude : 32.109333} latCenter={JSON.parse(userCoords) ? JSON.parse(userCoords).longitude : 34.855499} />
                        </Box>
                        <Box justifyContent='space-around' alignItems='center' width="60%" marginTop='120px'>
                            <EventList events={events} loading={loading} />
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
