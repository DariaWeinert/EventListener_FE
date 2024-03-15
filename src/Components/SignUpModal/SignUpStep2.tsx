import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, Box, Button, Flex, FormControl, FormLabel, Grid, GridItem, Input, ModalFooter, Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import PictureInput from "./DragPhoto";
import axios from 'axios';


interface Step2Props {
    onNextStep: () => void;
    onPrevStep: () => void;
    onFileChange: (file: File) => void;
}

interface CityCoordinates {
    city: string;
    latitude: number;
    longitude: number;
}

const Step2: React.FC<Step2Props> = ({ onNextStep, onPrevStep, onFileChange }) => {
    const [city, setCity] = useState<string>("")
    const [cityCoords, setCityCoords] = useState<CityCoordinates | null>(null);
    const [error, setError] = useState<string>('');

    const handlePrevStep = () => {
        onPrevStep();
    };

    const handleNextStep = () => {
        onNextStep();
    };


    const handleFocus = () => {
        if (city) {
            console.log('onfocus');
        }
    };

    const handleBlur = () => {
        if (city) {
            fetchCityCoordinates(city);
        }
    };

    // Функция для отправки запроса к API
  const fetchCityCoordinates = async (cityName: string) => {
        try {
            setError('');
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=geojson&accept-language=en`);
            const data = response.data;
            if (data.features.length > 0) {
                const coordinates = data.features[0].geometry.coordinates;
                const coords: CityCoordinates = {
                    city: cityName,
                    latitude: coordinates[1],
                    longitude: coordinates[0]
                };
                setCityCoords(coords);
                // Сохранение координат города в локальное хранилище
                localStorage.setItem('cityCoords', JSON.stringify(coords));
                localStorage.setItem('city', city)
                console.log(city, coords)
            } else {
                setError('City not found');
            }
        } catch (error) {
            console.error('Error fetching city coordinates:', error);
            setError('Error fetching city coordinates');
        }
    };

        const handleFileChange = (file: File) => {
            onFileChange(file); 
            console.log('Selected file:', file);
        };
    return (
        <Box pt="1.5rem">
            <Grid templateColumns="repeat(1, 1fr)" gap={4}>
                <GridItem>
                    <FormControl>
                        <FormLabel>Add Profile Picture</FormLabel>
                        <Flex justifyContent="center" alignItems="center">
                            <PictureInput onChange={handleFileChange} />
                        </Flex>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel>City</FormLabel>
                        <Input
                type="text"
                color='#4a5568'
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
                        
                    </FormControl>
                </GridItem>
            </Grid>
            <ModalFooter>
                <Button onClick={handlePrevStep} mr={3}>
                    Previous
                </Button>
                <Button mr='-1.5rem' colorScheme='red' onClick={handleNextStep} isDisabled={!!error}>Next</Button>
                
            </ModalFooter>
            {error && (
                <Alert mt='0.2rem' mb='1rem' status="error" borderRadius='5px'>
                    <AlertIcon />
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
            )}
        </Box>
    );
};


export default Step2;
