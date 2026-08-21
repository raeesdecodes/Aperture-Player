import { OpenSubtitlesApiClient } from '../src/data/remote/openSubtitles/openSubtitlesApi';

describe('OpenSubtitlesApiClient', () => {
  let client: OpenSubtitlesApiClient;

  beforeEach(() => {
    client = new OpenSubtitlesApiClient('test-api-key');
    (globalThis as any).fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('searches subtitles successfully', async () => {
    const mockApiResponse = {
      total_count: 1,
      data: [
        {
          id: 'sub-123',
          attributes: {
            subtitle_id: '123',
            language: 'en',
            download_count: 50,
            ratings: 4.5,
            release: 'Big.Buck.Bunny.srt',
            files: [
              {
                file_id: 999,
                file_name: 'Big.Buck.Bunny.srt',
              },
            ],
          },
        },
      ],
    };

    ((globalThis as any).fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    });

    const results = await client.searchSubtitles({ filename: 'Big Buck Bunny' });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(results).toHaveLength(1);
    expect(results[0].fileId).toBe(999);
    expect(results[0].language).toBe('en');
    expect(results[0].fileName).toBe('Big.Buck.Bunny.srt');
  });

  it('downloads subtitle successfully', async () => {
    const mockDownloadResponse = {
      link: 'https://api.opensubtitles.com/download/file.srt',
      file_name: 'downloaded.srt',
      requests: 1,
      remaining: 99,
    };

    ((globalThis as any).fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDownloadResponse,
    });

    const result = await client.downloadSubtitle(999);

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(result.link).toBe('https://api.opensubtitles.com/download/file.srt');
    expect(result.fileName).toBe('downloaded.srt');
  });
});
