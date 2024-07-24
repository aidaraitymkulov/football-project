import { Standing } from "@/types";
import axios from "axios";
import moment from "moment";
import 'server-only';
import { USE_SAMPLE } from "../sampleData/useSample";
import getStandingsSample from "../sampleData/getStandingsSample";



export default async function getStandings(): Promise<Standing[]> {

    if(USE_SAMPLE) {
        return getStandingsSample()
    }

    const currentTime = moment();
    const month = currentTime.month();
    let year;

    if (month < 6) {
        year = currentTime.year() - 1;
    } else {
        year = currentTime.year();
    }

    const API_KEY: string = process.env.API_KEY as string;

    const options = {
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        },
        params: {
            season: year
        },
        next: {
            revalidate: 60 * 60 * 24
        }
    };

    const standings: Standing[] = [];

    const leagues = [
        { name: 'EPL', id: 39 },
        { name: 'La Liga', id: 140 },
        { name: 'Bundesliga', id: 78 },
        { name: 'Serie A', id: 135 },
        { name: 'Ligue 1', id: 61 },
    ];

    for (const league of leagues) {
        const url = `https://api-football-v1.p.rapidapi.com/v3/standings`;
        try {
            const response = await axios.get(url, {
                ...options,
                params: { ...options.params, league: league.id }
            });
            const data = response.data;
            const standing = data.response[0];
            if (standing) {
                standings.push(standing);
            }
        } catch (err) {
            console.error(`Error fetching standings for ${league.name}:`, err);
        }
    }
    console.log('Standings:', standings);
    return standings;
}
