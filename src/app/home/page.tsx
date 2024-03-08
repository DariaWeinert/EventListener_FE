'use client'
import React, { useState } from "react";
import { Flex, Box } from "@chakra-ui/react";
import NavBar from "@/Components/NavBar/NavBar";
import EventButton from "@/Components/EventButton/EventButton";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const handleSearch = () => {
      
    };

    return (
        <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            width="100%"
        >
            <Flex
                direction="row"
                alignItems="center"
                justifyContent="center"
                width="100%"
            >
                <NavBar onSearch={handleSearch} isLoggedIn={isLoggedIn} />

                <Box p={4}>
                    <EventButton
                        id="1"
                        topic="Встреча анонимных безработных"
                        date="2024-03-09"
                        time="10:00 AM"
                        backgroundImageUrl="https://example.com/image.jpg"
                    />
                      <EventButton
                        id="2"
                        topic="Sample Event 2"
                        date="2024-03-10"
                        time="10:00 AM"
                        backgroundImageUrl="https://example.com/image.jpg"
                    />
                       <EventButton
                        id="3"
                        topic="Sample Event 3"
                        date="2024-03-11"
                        time="10:00 AM"
                        backgroundImageUrl="https://example.com/image.jpg"
                    />
                       <EventButton
                        id="4"
                        topic="Sample Event 4"
                        date="2024-03-12"
                        time="10:00 AM"
                        backgroundImageUrl="https://example.com/image.jpg"
                    />
                </Box>

  
                <Box p={4}>
                    {/* calendar */}
                </Box>

   
                <Box p={4}>
                    {/* map */}
                </Box>
            </Flex>
        </Flex>
    );
}