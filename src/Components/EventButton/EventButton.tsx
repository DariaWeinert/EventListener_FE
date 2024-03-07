import React from 'react';
import { Box, Text, Image, Link } from '@chakra-ui/react';

interface EventButtonProps {
  id: string;
  topic: string;
  date: string;
  time: string;
  backgroundImageUrl: string;
}

const EventButton: React.FC<EventButtonProps> = ({ id, topic, date, time, backgroundImageUrl }) => {
  return (
    <Link href={`/events/${id}`} _hover={{ textDecoration: 'none' }}>
      <Box
        maxW="md"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        position="relative"
        transition="transform 0.2s"
        _hover={{ transform: 'scale(1.05)' }}
      >
        <Image src={backgroundImageUrl} alt={topic} />

        <Box p="6">
          <Box display="flex" alignItems="baseline">
            <Text color="gray.500" fontWeight="semibold">
              {date} at {time}
            </Text>
          </Box>

          <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
            {topic}
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

export default EventButton;