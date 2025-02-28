export class FilterDto {
  key: string;
  operation: string;
  value: any;
  type: string;
}

export class SearchQueryDto {
  search?: FilterDto[];
}
