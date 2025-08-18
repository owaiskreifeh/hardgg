import { NextRequest, NextResponse } from 'next/server';
import { gameOperations } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const genre = searchParams.get('genre');
    const size = searchParams.get('size');
    const language = searchParams.get('language');
    const sortBy = searchParams.get('sortBy') || 'title';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let games = [];

    // Apply search if query exists
    if (query) {
      games = await gameOperations.searchGames(query);
    } else {
      games = await gameOperations.getAllGames();
    }

    // Apply filters
    const filters: any = {};
    if (genre) filters.genre = genre.split(',');
    if (size) filters.size = size;
    if (language) filters.language = language.split(',');

    if (Object.keys(filters).length > 0) {
      games = await gameOperations.filterGames(filters);
    }

    // Apply sorting
    games.sort((a: any, b: any) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'releaseDate':
          aValue = new Date(a.releaseDate);
          bValue = new Date(b.releaseDate);
          break;
        case 'size':
          aValue = parseFloat(a.size.replace(' GB', ''));
          bValue = parseFloat(b.size.replace(' GB', ''));
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const total = games.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGames = games.slice(startIndex, endIndex);

    return NextResponse.json({
      games: paginatedGames,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}
