"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TypographyP,
  TypographyH3,
  TypographyMuted,
} from "@/components/ui/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Plus, 
  User, 
  Calendar, 
  MessageSquare, 
  FileText, 
  ExternalLink
} from "lucide-react";

// KanbanColumn component that renders a single column
const KanbanColumn = ({ column, items, index, totalItems, renderItem }) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TypographyH3 className="text-base font-medium">
            {column.title}
          </TypographyH3>
          <Badge variant="secondary" className="rounded-full font-normal text-xs">
            {items.length}
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[calc(100vh-280px)] p-3 rounded-lg transition-colors h-full overflow-y-auto ${
              snapshot.isDraggingOver ? 'bg-muted/60' : 'bg-muted/30'
            }`}
            style={{ maxHeight: 'calc(100vh - 280px)' }}
          >
            {items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`mb-3 ${
                      snapshot.isDragging ? 'rotate-1 opacity-90' : ''
                    }`}
                  >
                    {renderItem ? renderItem(item) : <KanbanCard item={item} />}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

// Default KanbanCard component that can be overridden by renderItem
const KanbanCard = ({ item }) => {
  return (
    <Card className="p-4 bg-card shadow-sm hover:shadow transition-shadow mb-2">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.avatar} alt={item.name} />
              <AvatarFallback>{item.name ? item.name.charAt(0) : 'U'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <TypographyP className="font-medium text-sm line-clamp-1">{item.name}</TypographyP>
              <span className="text-xs text-muted-foreground truncate block">{item.title}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <User className="h-4 w-4 mr-2" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Calendar className="h-4 w-4 mr-2" /> Schedule Interview
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <MessageSquare className="h-4 w-4 mr-2" /> Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2" /> View Resume
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <ExternalLink className="h-4 w-4 mr-2" /> View Application
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {item.tags && item.tags.map((tag, i) => (
            <Badge variant="secondary" key={i} className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <TypographyMuted className="text-xs truncate">{item.jobPosition || "Position not specified"}</TypographyMuted>
        
        {item.info && (
          <div className="mt-2 border-t pt-2 text-xs text-muted-foreground">
            {item.info.map((info, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="truncate">{info.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

// Main KanbanBoard component
export default function KanbanBoard({ columns, items, onDragEnd, renderItem }) {
  // Group items by column
  const groupedItems = columns.reduce((result, column) => {
    result[column.id] = items.filter(item => item.status === column.id);
    return result;
  }, {});

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column, index) => (
          <KanbanColumn
            key={column.id}
            column={column}
            items={groupedItems[column.id] || []}
            index={index}
            totalItems={items.length}
            renderItem={renderItem}
          />
        ))}
      </div>
    </DragDropContext>
  );
} 