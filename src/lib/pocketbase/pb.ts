import PocketBase from 'pocketbase';
import { PB_URL } from '$env/static/private';
import type { TypedPocketBase } from './pb_types';

export const pb = new PocketBase(PB_URL) as TypedPocketBase;
