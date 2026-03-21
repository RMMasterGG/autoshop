import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

/**
 * Загрузчик файлов переводов для библиотеки Transloco
 * Реализует интерфейс TranslocoLoader для асинхронной загрузки JSON файлов с переводами
 * Адаптирован для работы в серверном и клиентском окружении (SSR)
 *
 * @author SEMASEM
 * @version 1.0.0
 * @see {@link TranslocoLoader} Интерфейс загрузчика переводов
 * @see {@link Translation} Тип данных для переводов
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  /** HTTP клиент для выполнения запросов к серверу */
  private http = inject(HttpClient);

  /** Идентификатор платформы для определения окружения (браузер/сервер) */
  private platformId = inject(PLATFORM_ID);

  /**
   * Загружает файл перевода для указанного языка
   * В серверном окружении использует полный URL (http://localhost:4201)
   * В браузерном окружении использует относительный путь
   *
   * @param {string} lang - Код языка для загрузки (например, 'en', 'ru')
   * @returns {Observable<Translation>} Observable с объектом переводов
   *
   * @example
   * // Загрузка английских переводов в браузере
   * getTranslation('en') // GET /i18n/en.json
   *
   * @example
   * // Загрузка русских переводов на сервере
   * getTranslation('ru') // GET http://localhost:4201/i18n/ru.json
   *
   * @throws {HttpErrorResponse} При ошибке загрузки файла переводов
   */
  getTranslation(lang: string) {
    const baseUrl = 'http://localhost:4201';

    return this.http.get<Translation>(`${baseUrl}/i18n/${lang}.json`);
  }
}
