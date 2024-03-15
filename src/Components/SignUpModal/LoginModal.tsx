import { useState } from 'react';
import { Input, Button, ModalBody, FormLabel, Flex, Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import Link from 'next/link';
import { SERVER_URL } from '../../../api';

interface AuthResponse {
    success: boolean;
    error?: string;
}

interface LoginModalProps {
    onClose: () => void;
}

interface CityCoordinates {
    city: string;
    latitude: number;
    longitude: number;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [city, setCity] = useState<string>("")
    const [cityCoords, setCityCoords] = useState<CityCoordinates | null>(null);
    const [error, setError] = useState<string>('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };


 
    const handleLogin = async () => {
        try {
            const response = await axios.post(`${SERVER_URL}/auth/login`, {
                email: email,
                password: password
            });
    
            if (response.status >= 200 && response.status < 300) {
                if (city.trim() === '') {
                    setError('City not found');
                        return;
                    }

                const accessToken = response.data.access_token;
                localStorage.setItem('accessToken', accessToken);
                const userName = response.data.firstName;
                localStorage.setItem('userName', userName);
                const userId = response.data.user_id;
                localStorage.setItem('userId', userId);
                console.log('name', userName)
                console.log('userId', userId)
    
                console.log('Login successful');
                onClose();
            } else {
                throw new Error('Login failed: ' + JSON.stringify(response.data)); 
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    const responseData:any = axiosError.response.data;
                    const errorMessage = responseData.message || responseData.error || `Status code: ${axiosError.response.status}`;
                    console.error('Login failed:', errorMessage);
                    setError(errorMessage);
                } else {
                    console.error('Login failed:', axiosError.message);
                    setError(axiosError.message);
                }
            } else {
                console.error('Login failed:', error.message);
                setError(error.message);
            }
        }
    };
    

    const handleFocus = () => {
        if (city) {
            if (city.trim() === '') {
                setError('City not found');
                    return;
                }
            console.log('onfocus');
        }
    };

    const handleBlur = () => {
        if (city) {
            fetchCityCoordinates(city);
            
        }
    };

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
               
            }
        } catch (error) {
            console.error('Error fetching city coordinates:', error);
            setError('Error fetching city coordinates');
        }
    };

    return (
        <ModalBody>
            <FormLabel mt='0.5rem'>E-mail</FormLabel>
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                mb="3"
                color='#4a5568'
            />
            <FormLabel mt='0.5rem'>Password</FormLabel>
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                mb="3"
                color='#4a5568'
            />
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
            <Flex flexDirection='row' justifyContent='flex-end'>
            <Link href="" passHref><Button mt='1rem' mb='1rem' colorScheme="red" onClick={handleLogin}>Login</Button></Link>
            </Flex>
            {error && (
                                <>
                                <Alert mb='1rem' status="error" borderRadius='5px'>
                                    <AlertIcon />
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                                </>
                            )}

        </ModalBody>
    );
};

export default LoginModal;
