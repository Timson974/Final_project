import {CategoriesUrl} from "../../../types/categories.type";

export class CategoriesValueUtil {
  static getCategoriesValue (category: string): string {

    switch (category.toLowerCase()) {
      case 'фриланс':
        return CategoriesUrl.frilans
      case 'дизайн':
        return CategoriesUrl.dizain
      case 'smm':
        return CategoriesUrl.smm
      case 'таргет':
        return CategoriesUrl.target
      case 'копирайтинг':
        return CategoriesUrl.kopiraiting

      default:
        return 'undefined'
    }
  }
}
