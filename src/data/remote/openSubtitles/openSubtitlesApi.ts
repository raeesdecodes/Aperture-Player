import {
  OpenSubtitlesSearchQuery,
  OpenSubtitleResultItem,
  OpenSubtitlesSearchResponse,
  OpenSubtitlesDownloadResponse,
} from './openSubtitlesTypes';

const OPENSUBTITLES_API_BASE = 'https://api.opensubtitles.com/api/v1';

export class OpenSubtitlesApiClient {
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  public async searchSubtitles(
    query: OpenSubtitlesSearchQuery,
  ): Promise<OpenSubtitleResultItem[]> {
    const params = new URLSearchParams();
    if (query.filename) params.append('query', query.filename);
    if (query.imdbId) params.append('imdb_id', query.imdbId);
    if (query.hash) params.append('moviehash', query.hash);
    if (query.language) params.append('languages', query.language);

    const url = `${OPENSUBTITLES_API_BASE}/subtitles?${params.toString()}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'AperturePlayer v1.0.0',
    };
    if (this.apiKey) {
      headers['Api-Key'] = this.apiKey;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`OpenSubtitles API error: HTTP ${response.status}`);
    }

    const data: OpenSubtitlesSearchResponse = await response.json();
    if (!data || !data.data) {
      return [];
    }

    const results: OpenSubtitleResultItem[] = [];
    for (const item of data.data) {
      const attrs = item.attributes;
      const file = attrs.files?.[0];
      if (file) {
        results.push({
          id: item.id,
          fileId: file.file_id,
          fileName: file.file_name || attrs.release || 'subtitle.srt',
          language: attrs.language || 'en',
          downloadCount: attrs.download_count || 0,
          rating: attrs.ratings || 0,
          release: attrs.release || '',
        });
      }
    }

    return results;
  }

  public async downloadSubtitle(
    fileId: number,
  ): Promise<{ link: string; fileName: string }> {
    const url = `${OPENSUBTITLES_API_BASE}/download`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'AperturePlayer v1.0.0',
    };
    if (this.apiKey) {
      headers['Api-Key'] = this.apiKey;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ file_id: fileId }),
    });

    if (!response.ok) {
      throw new Error(`OpenSubtitles Download error: HTTP ${response.status}`);
    }

    const data: OpenSubtitlesDownloadResponse = await response.json();
    return {
      link: data.link,
      fileName: data.file_name || 'downloaded_subtitle.srt',
    };
  }
}

export const openSubtitlesApi = new OpenSubtitlesApiClient();
