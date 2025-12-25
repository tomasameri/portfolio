'use client';

import { useState } from 'react';
import { CardGroup } from '@/types/bento';
import CardGroupComponent from './CardGroup';
import CardGroupModal from './CardGroupModal';

interface CardGroupsGridProps {
  groups: CardGroup[];
}

export default function CardGroupsGrid({ groups }: CardGroupsGridProps) {
  const [selectedGroup, setSelectedGroup] = useState<CardGroup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenGroup = (group: CardGroup) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  return (
    <>
      <div className="space-y-8">
        {groups.map((group) => (
          <CardGroupComponent
            key={group.id}
            group={group}
            onOpen={handleOpenGroup}
          />
        ))}
      </div>
      <CardGroupModal
        group={selectedGroup}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

