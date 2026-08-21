export interface OpenSubtitlesSearchQuery {
  hash?: string;
  filename?: string;
  imdbId?: string;
  language?: string;
}

export interface OpenSubtitleResultItem {
  id: string;
  fileId: number;
  fileName: string;
  language: string;
  downloadCount: number;
  rating: number;
  release: string;
}

export interface OpenSubtitlesSearchResponse {
  total_count: number;
  data: Array<{
    id: string;
    attributes: {
      subtitle_id: string;
      language: string;
      download_count: number;
      ratings: number;
      release: string;
      files: Array<{
        file_id: number;
        file_name: string;
      }>;
    };
  }>;
}

export interface OpenSubtitlesDownloadResponse {
  link: string;
  file_name: string;
  requests: number;
  remaining: number;
}
