import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'removeWww'})
export class RemoveWwwPipe implements PipeTransform {
    transform(url: string): string {
        return url.replace("/www.", "/");
    }
}
