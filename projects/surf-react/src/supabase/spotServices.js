import { client } from './client';

export async function getAllSpots() {
    const { data, error } = await client
        .from('spots')
        .select('*');

    if (error) {
        console.error('Error fetching spots:', error);
        return [];
    }

    return data;
}

export async function getSpotByName(name) {
    const { data, error } = await client
        .from('spots')       // tabla en minúscula
        .select('*')
        .eq('name', name)    // columna en minúscula
        .single();

    if (error) {
        console.error('Error fetching spot by name:', error);
        return null;
    }

    return data;
}