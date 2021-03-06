import { UserFactory } from './user';
import { ProductList } from '../entities';
import { PhotoService } from '../services/photo';

export interface OwnerJsonProps {
    student_id: number;
    student_name: string;
    student_class: string;
    profile_photo: string;
    leader_flg: boolean;
}

export interface ProductJsonProps {
    product_id: number;
    entry_order: number;
    product_number: number;
    head_shot: string;
    owner: OwnerJsonProps;
    theme: string;
}

export class ProductListFactory {
    public static createFromJSON(p: ProductJsonProps) {
        return new ProductList(
            p.product_id,
            p.entry_order,
            PhotoService.getS3PhotoPath(p.head_shot),
            UserFactory.createFromJSON(p.owner),
            p.theme,
        );
    }
}
