import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import settings from '@/data/settings.json';

const SettingsPage = () => {
  const [title, setTitle] = useState(settings.title);
  const [description, setDescription] = useState(settings.description);

  const handleSave = () => {
    // Here you would typically save the data to a backend or local storage
    console.log('Saved:', { title, description });
    alert('Settings saved!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Blog Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Blog Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Blog Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button onClick={handleSave}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
