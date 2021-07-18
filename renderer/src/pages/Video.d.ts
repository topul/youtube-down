export type FormatsSelect = {
  value: string;
  label: string;
};

export interface FormValue {
  url: string;
  startPlaylist: number;
  endPlaylist: number;
  thumbnail: boolean;
  formatNote: string;
  ext: string;
  formatsNote: FormatsSelect[];
  formatsExt: FormatsSelect[];
  showPlaylist: boolean;
  infoLoading: boolean;
}

export type VideoFormat = {
  format_note: string;
  format_id: string;
  ext: string;
};

type Thumbnail = {
  url: string;
  width: number;
  height: number;
  resolution: string;
};

export interface VideoInfo {
  _type?: string;
  formats: VideoFormat[];
  thumbnail: string;
  thumbnails: Thumbnail[];
  webpage_url: string;
  title: string;
}
