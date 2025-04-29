import { client } from './client';

export async function getAllSpots() {
    const { data, error } = await client
        .from('Spots')
        .select('*');

    if (error) {
        console.error('Error fetching spots:', error);
        return [];
    }

    return data;
}

export async function getSpotByName(name) {
    const { data, error } = await client
        .from('Spots')
        .select('*')
        .eq('Name', name)
        .single();

    if (error) {
        console.error('Error fetching spot by name:', error);
        return null;
    }

    return data;
}