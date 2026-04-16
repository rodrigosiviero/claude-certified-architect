export interface MindMapNode {
  id: string;
  label: string;
  detail?: string;
  color: string;
  children?: MindMapNode[];
}

export interface DomainMindMap {
  domainId: string;
  title: string;
  color: string;
  root: MindMapNode;
}
