import { map } from 'rxjs';
import type { ApiResponse } from '../../core/models/api-response.model';

export function unwrapResponse<T>() {
  return map((res: ApiResponse<T>) => {
    if (!res.success) {
      throw new Error(res.message || 'Unknow API Error');
    }
    return res.data;
  });
}
