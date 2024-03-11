'use client'
import React, { useState, useEffect } from 'react';
import { Flex, Box, useBreakpointValue } from '@chakra-ui/react';
import NavBar from '@/Components/NavBar/NavBar';
import Calendar from '@/Components/Calendar/Calendar';
import dynamic from 'next/dynamic';
import axios from 'axios';
import EventList from '@/Components/EventList/EventList';
import { SERVER_URL } from '../../../api';
import './Home.css';

interface Event {
  _id: string;
  creator: string;
  date: string;
  street: string;
  street_number: string;
  city: string;
  country: string;
  topic: string;
  place: string;
  category: string[];
  joinedBy: string[];
  savedBy: string[];
  membersAmount: number;
  budget: number;
  imageURL: string;
  lat: string;
  lon: string;
}

const DynamicMap = dynamic(() => import('@/Components/Map/Map'), { ssr: false });

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [addresses, setAddresses] = useState<Event[]>([]);

  const handleSearch = () => {};
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

  return (
    <Flex className="home-container" direction="column">
      <NavBar onSearch={handleSearch} isLoggedIn={isLoggedIn} userId={""} />
      <Flex
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        width="100%"
        marginTop="100px" 
        paddingLeft="100px"
        paddingRight="20px" 
      >
        <Calendar/>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          alignItems="flex-start"
          justifyContent="flex-start"
          width="100%"
          marginBottom="20px"     
          marginLeft="0">
          <Box width={{ base: "100%", md: "100%" }}>
            <EventList events={events} />
          </Box>
          <Box width={{ base: "100%", md: "60%" }}>
            <DynamicMap events={addresses} />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;