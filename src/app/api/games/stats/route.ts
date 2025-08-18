import { NextRequest, NextResponse } from 'next/server';
import { gameOperations } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const games = await gameOperations.getAllGames();

    // Calculate statistics
    const stats = {
      totalGames: games.length,
      genres: {},
      languages: {},
      sizeRanges: {
        '0-1 GB': 0,
        '1-5 GB': 0,
        '5-10 GB': 0,
        '10-20 GB': 0,
        '20+ GB': 0
      },
      averageSize: 0
    };

    let totalSize = 0;
    let sizeCount = 0;

    games.forEach((game: any) => {
      // Count genres
      game.genre?.forEach((genre: string) => {
        stats.genres[genre] = (stats.genres[genre] || 0) + 1;
      });

      // Count languages
      game.language?.forEach((lang: string) => {
        stats.languages[lang] = (stats.languages[lang] || 0) + 1;
      });

      // Calculate size statistics
      if (game.size && game.size !== 'Unknown') {
        const sizeNum = parseFloat(game.size.replace(' GB', ''));
        if (!isNaN(sizeNum)) {
          totalSize += sizeNum;
          sizeCount++;

          if (sizeNum <= 1) stats.sizeRanges['0-1 GB']++;
          else if (sizeNum <= 5) stats.sizeRanges['1-5 GB']++;
          else if (sizeNum <= 10) stats.sizeRanges['5-10 GB']++;
          else if (sizeNum <= 20) stats.sizeRanges['10-20 GB']++;
          else stats.sizeRanges['20+ GB']++;
        }
      }
    });

    stats.averageSize = sizeCount > 0 ? totalSize / sizeCount : 0;

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
