"use client";
import { Team } from '@/types';
import './SearchBar.scss'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SearchBar({
    teamsData
}: {teamsData: Team[];

}) {
    
    const [searchTeam, setSearchTeam] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [showFilteredBox, setShowFilteredBox] = useState(false);

    let router = useRouter();

    const filteredTeams = teamsData.filter(team =>
        team.team.name.toLowerCase().includes(searchTeam.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTeam(e.target.value);
        setFocusedIndex(-1);
        setShowFilteredBox(true);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            let length = 0;
            if (filteredTeams.length > 10) {
                length = 10;
            } else {
                length = filteredTeams.length;
            }
            console.log(focusedIndex)
            setFocusedIndex(prevIndex => (prevIndex < length - 1 ? prevIndex + 1 : prevIndex));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setFocusedIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        } else if (e.key === 'Enter') {
            if (focusedIndex !== -1) {
                const teamId = filteredTeams[focusedIndex].team.id;
                router.push(`/team/${teamId}`);
                setSearchTeam('');
            }
        }
    }

    const handleTeamItemClick = () => {
        setSearchTeam('');
    }

    const teamListRef = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (e: MouseEvent) => {
        if (teamListRef.current && !teamListRef.current.contains(e.target as Node)) {
            setShowFilteredBox(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
            console.log(teamsData)
        }
    }, [])
    return (
        <div className='searchBar__container'>
        <input type="text"
        value={searchTeam}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder='Search for a team'
        className='searchBar__input'
        />
        {
            searchTeam && filteredTeams.length > 0&&showFilteredBox ? (
                <div className='searchBar__list'>{filteredTeams.slice(0, 10).map((standing, i) => (
                    <Link 
                    href={`/team/${standing.team.id}`}
                    key = {standing.team.id}
                    className={`searchBar__team ${i === focusedIndex ? 'focused' : ''}`}
                    onClick = {() => handleTeamItemClick()}
                    >
                        {standing.team.name}
                    </Link>
                ))}</div>
            ):null
        }
    </div>
    )
}